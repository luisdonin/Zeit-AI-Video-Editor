import ffmpeg


start_time = '00:00:10' # Start time for trimming (HH:MM:SS)
end_time = '00:00:20' # End time for trimming (HH:MM:SS)

(
	ffmpeg.input("input.mp4", ss=start_time, to=end_time)
	.output("trimmed_output.mp4")
	.run()
)