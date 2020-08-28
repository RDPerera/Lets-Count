#!/bin/sh
b=0
while [ $b -lt $[ ($RANDOM % 600 ) + 1 ] ]
do
	a=0
	while [ $a -lt 10 ]
	do
		echo $[ ( $RANDOM % 100 )  + 1 ]  | tee -a file.html
		a=`expr $a + 1`
	done
	git add .
	git commit -m "Done"
	git push -u origin master
	b=`expr $b + 1`
done