#!/bin/bash

echo $1

DIR="lakes/"
echo $DIR

for f in "$DIR"*.geojson
do
  # echo "Processing $f..."


  dest="${f/.geojson//vector.svg}"
  # echo $dest
  mapshaper $f -o $dest

  # take action on each file. $f store current file name
  # perform some operation with the file
done