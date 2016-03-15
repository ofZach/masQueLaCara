
#!/bin/bash

if [ $# -eq 1 ]
then
    MASK_NAME="$1"
    mkdir "src/masks/$MASK_NAME"
    sed "s/emptyMask/$MASK_NAME/g" src/masks/emptyMask/emptyMask.js > "src/masks/$MASK_NAME/$MASK_NAME.js"
else
    echo "Usage: ./generateMask.sh maskName"
fi