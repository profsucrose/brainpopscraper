#!/bin/bash

# science/earthsystem/carboncycle
# 2826374.mp4
#QjIxm-OVxKn_HVymboAye1iyhKvLV2dh4calIpvMtdhgRgUul1oL7xnhYBmaH8KWK4qGx9dziLo5VYWtaEGiJqt8rQpi1zMySf3wOXJ_zCMYEQ52TDBDvdBYz5k7YLXU1rClyJRvCQFZp_BuaTqp02A6nC3MSMz53y-r1uiqyX-sdoIG4A1CCuXhRnZJhynG2PgR9LBPnD5vJdfgPOyb30lAJk07dIs1DpKimliMP3tklrAYIKXFEfGfTvYV5B9lGm3rkMQMF6teRHmUwM3IjgZ85FmyvClb5Jkkxb4wsLulR8Wzk83DaGS5ZOoIiQ
# Crystals

scrapbrainpop() {
	rm -r scrapedMovies
	mkdir scrapedMovies
	rm concatlist.txt

	length=0
	oldLength=0
	running=1
	echo "file 'scrapedMovies/$length.mp4'" >> "concatlist.txt"
	while [ $running -eq 1 ]
	do
		echo 'https://hls.brainpop.com/'$1'/movies/'$2'+'$((length * 1000))'.ts?'$3
		curl 'https://hls.brainpop.com$1movies/$2+$((length * 1000)).ts?'$3 -H 'Connection: keep-alive' -H 'Origin: https://www.brainpop.com' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36' -H 'Accept: */*' -H 'Sec-Fetch-Site: same-site' -H 'Sec-Fetch-Mode: cors' -H 'Referer: https://www.brainpop.com/'$1 -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9' --compressed -o scrapedMovies/$length.ts
		ffmpeg -i scrapedMovies/$length.ts -c:v libx264 -c:a copy scrapedMovies/$length.mp4 
		rm scrapedMovies/$length.ts
		oldLength=$length
		clipLength=`ffmpeg -i scrapedMovies/$length.mp4 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,// | sed 's@\..*@@g' | awk '{ split($1, A, ":"); split(A[3], B, "."); print 3600*A[1] + 60*A[2] + B[1] }'`
		length=$((clipLength + length))
		if [ $length -eq $oldLength ]; then
			running=0
		fi
		echo "file 'scrapedMovies/$length.mp4'" >> "concatlist.txt"
	done

	ffmpeg -f concat -safe 0 -i concatlist.txt -c copy fullMovies/$4.mp4
}