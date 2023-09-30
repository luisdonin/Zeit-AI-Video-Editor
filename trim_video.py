import ffmpeg
import math
from sys import argv

def main():
    interval = float(argv[2])
    input_file = str(argv[1])
    infos = ffmpeg.probe(input_file, 'ffprobe')
    video_duration = float(infos['format']['duration'])
    number_of_cuts = math.ceil(video_duration/interval)

    for i in range(0, number_of_cuts):
        if (video_duration - i * interval) >= interval:
            size = interval
        else:
            size = (video_duration - i * interval) % interval
        stream = ffmpeg.input(input_file, ss=i * interval, t = size)
        stream = ffmpeg.output(stream, f'trimmed_{i}.mp4', vcodec='libx264')
        stream = ffmpeg.run(stream)

if __name__ == '__main__':
    main()