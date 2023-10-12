const ytdl = require('ytdl-core')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')

module.exports = 
{
        downloadVideo: function(videoURL, videoFilePath, audioFilePath, mergedFilePath, videoFormatPredefined, audioFormatPredefined){
                ytdl.getInfo(videoURL).then(info => {
                        // gets all the available formats up to 1080p
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
                                    })
                                    .on('error', (err) => {
                                            throw err;
        
                                    })
                                    .run();
                        };	
                    
                        videoStream.on('error', (err) => {
                                throw err;
                        });
            
                        audioStream.on('error', (err) => {
                                throw err;
                        });
                }).catch(err => {
                        throw err;
                })
        }
}



// function downloadVideo(videoURL, videoFilePath, audioFilePath, mergedFilePath, videoFormatPredefined, audioFormatPredefined){
//         ytdl.getInfo(videoURL).then(info => {
//                 // gets all the available formats up to 1080p
//                 const videoFormats = info.formats.filter(format => 
//                             format.hasVideo && 
//                     (
//                             format.qualityLabel === "1080p" || 
//                             format.qualityLabel === "720p" || 
//                             format.qualityLabel === "480p" || 
//                             format.qualityLabel === "360p" || 
//                             format.qualityLabel === "240p" || 
//                             format.qualityLabel === "144p"
//                     ));
        
//                 const audioFormats = info.formats.filter(format => format.hasAudio);
    
//                 const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' , format: audioFormatPredefined });
//                 // downloads the highest available format up to 1080p
//                 const videoFormat = ytdl.chooseFormat(videoFormats, { quality: 'highestvideo' , format: videoFormatPredefined });
        
//                 const videoStream = ytdl(videoURL, { format: videoFormat });
//                 const audioStream = ytdl(videoURL, { format: audioFormat });
    
//                 videoStream.pipe(fs.createWriteStream(videoFilePath));
//                 audioStream.pipe(fs.createWriteStream(audioFilePath));
    
//                 let finishedStreams = 0;
    
//                 audioStream.on('end', () => {
//                         console.log("Audio download finished");
//                         console.log(`Saved to '${audioFilePath}'`);
//                         finishedStreams++;
//                         if (finishedStreams === 2) {
//                                 mergeAudioAndVideo();
//                         }
//                 });
    
//                 videoStream.on('end', () => {
//                         console.log("Video download finished");
//                         console.log(`Saved to '${videoFilePath}'`);
//                         finishedStreams++;
//                         if (finishedStreams === 2) {
//                                 mergeAudioAndVideo();
//                         }
//                 });
    
//                 const mergeAudioAndVideo = () => {
//                             console.log("Merging audio and video.....")
//                         ffmpeg()
//                                 .input(audioFilePath)
//                             .input(videoFilePath)
//                             .output(mergedFilePath)
//                             .videoCodec('libx264')
//                             .audioCodec('aac')
//                             .on('end', () => {
//                                     console.log(`Finished merging audio and video, saved to '${mergedFilePath}'`);
//                             })
//                             .on('error', (err) => {
//                                     throw err;

//                             })
//                             .run();
//                 };	
            
//                 videoStream.on('error', (err) => {
//                         throw err;
//                 });
    
//                 audioStream.on('error', (err) => {
//                         throw err;
//                 });
//         }).catch(err => {
//                 throw err;
//         })
// };