#https://developer.arm.com/open-source/gnu-toolchain/gnu-rm/downloads

export PATH="/Users/gabrielvalky/Downloads/gcc-arm-none-eabi-7-2018-q2-update/bin/":"$PATH"
mkdir -p build
cd build

arm-none-eabi-gcc -Wall -Os -Werror -fno-common -mcpu=cortex-m3 -mthumb -msoft-float -MD -I ../ -I ../FWLib/inc -c ../main.c ../startup.c
arm-none-eabi-gcc -mcpu=cortex-m3 -mthumb -o output.elf -nostartfiles -T ../app.lds ./main.o ./startup.o

arm-none-eabi-objcopy -O binary ./output.elf ./output.bin
arm-none-eabi-objcopy -O ihex ./output.elf ./output.hex
arm-none-eabi-readelf -all output.elf > output.txt
arm-none-eabi-objdump -d -S output.elf > output.asm

# disable automount https://discussions.apple.com/docs/DOC-7942 by adding this line using sudo vifs
# sudo vifs, sudo automount -vc
# UUID=0C6BB56F-CEA7-3564-A81A-FB98D5C3BC33 none msdos rw,noauto

cd ..
#mkdir fs
sudo mount -t msdos /dev/disk2 fs
touch fs/.metadata_never_index
ls -a fs/
cat fs/output.rdy
rm fs/output.rdy
#rm -r "fs/System Volume Information"
cp build/output.hex fs/output.hex
sudo umount fs
#rm -r fs