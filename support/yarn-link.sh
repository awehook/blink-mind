 cd '../packages'
 for dir in `ls .`
 do
   if [ -d $dir ]
   then
     cd $dir
     if [ $1 = "link" ]
     then
      yarn link
     elif [ $1 = "unlink" ]
     then
      yarn unlink
      fi
     cd ..
   fi
done