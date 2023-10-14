const ytdl = require('ytdl-core')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')

module.exports = 
{
        downloadVideo: function(videoURL, savePath, videoFormatPredefined, audioFormatPredefined){
                return new Promise((resolve, reject) => {
                ytdl.getInfo(videoURL).then(info => {
                        // gets all the available formats up to 1080p
                        savePath = savePath.split(" ").join("_");
                        const videoFilePath = savePath + info.videoDetails.title + "." + videoFormatPredefined;
                        const audioFilePath = savePath + info.videoDetails.title + "." + audioFormatPredefined;
                        const mergedFilePath = savePath + info.videoDetails.title + "_merged.mp4";

                        const videoFormats = info.formats.filter(format => 
                                    format.hasVideo && 
                            (
                                    format.qualityLabel === "1080p" || 
                                    format.qualityLabel === "720p" || 
                                    format.qualityLabel === "480p" || 
                                    format.qualityLabel === "360p" || 
                                    format.qualityLabel === "240p" || 
                                    format.qualityLabel === "144p"
                            ));
                
                        const audioFormats = info.formats.filter(format => format.hasAudio);
            
                        const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' , format: audioFormatPredefined });
                        // downloads the highest available format up to 1080p
                        const videoFormat = ytdl.chooseFormat(videoFormats, { quality: 'highestvideo' , format: videoFormatPredefined });
                
                        const videoStream = ytdl(videoURL, { format: videoFormat });
                        const audioStream = ytdl(videoURL, { format: audioFormat });
            
                        videoStream.pipe(fs.createWriteStream(videoFilePath));
                        audioStream.pipe(fs.createWriteStream(audioFilePath));
            
                        let finishedStreams = 0;
            
                        audioStream.on('end', () => {
                                console.log("Audio download finished");
                                console.log(`Saved to '${audioFilePath}'`);
                                finishedStreams++;
                                if (finishedStreams === 2) {
                                        mergeAudioAndVideo();
                                }
                        });
            
                        videoStream.on('end', () => {
                                console.log("Video download finished");
                                console.log(`Saved to '${videoFilePath}'`);
                                finishedStreams++;
                                if (finishedStreams === 2) {
                                        mergeAudioAndVideo();
                                }
                        });
            
                        const mergeAudioAndVideo = () => {
                                    console.log("Merging audio and video.....")
                                ffmpeg()
                                        .input(audioFilePath)
                                    .input(videoFilePath)
                                    .output(mergedFilePath)
                                    .videoCodec('libx264')
                                    .audioCodec('aac')
                                    .on('end', () => {
                                            console.log(`Finished merging audio and video, saved to '${mergedFilePath}'`);
                                            fs.unlink(audioFilePath, (err) => {
                                                        if (err) {
                                                                console.error(err);
                                                        }
                                            });
                                            fs.unlink(videoFilePath, (err) => {
                                                if (err) {
                                                        console.error(err);
                                                }
                                            });
                                            resolve({videoTitle: info.videoDetails.title, mergedFilePath: mergedFilePath});
                                    })
                                    .on('error', (err) => {
                                            reject(err);
                                            throw err;
        
                                    })
                                    .run();
                        };	
                    
                        videoStream.on('error', (err) => {
                                throw err;
                                reject(err);
                        });
            
                        audioStream.on('error', (err) => {
                                throw err;
                                reject(err);
                        });
                }).catch(err => {
                        throw err;
                        reject(err);
                })
        });
}
};