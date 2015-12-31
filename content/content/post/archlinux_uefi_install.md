+++
date = "2015-12-28T19:50:36-08:00"
draft = true
title = "archlinux_uefi_install"

+++

## Creating the USB stick (Mac OS X):

```
% sudo diskutil unmountDisk /dev/disk3
% sudo dd if=$HOME/Downloads/archlinux-2015.12.01-dual.iso of=/dev/rdisk3 bs=1m
```

## Making a bootable Arch Linux system.

```
# enable wireless networking
wifi-menu

# look at available disks
fdisk -l

# setup boot disk partitions
cgdisk /dev/sdX
New: (1) 250M partition of type ef00 # EFI
New: (2) 750M partition of type 8300 # boot
New: (3) remaining space used for partition of type 8300 # /

# verify that kernel sees new table
fdisk -l /dev/sdX

# format partitions, using a volume manager for the 3rd partition.
mkfs.vfat -F32 /dev/sdX1
mkfs.ext2 /dev/sdX2
pvcreate /dev/sdx3
vgcreate bootvg /dev/sdx3
lvcreate --size 30G bootvg --name root
mkfs.ext4 /dev/mapper/bootvg-root

# mount our partitions
mount /dev/mapper/bootvg-root /mnt
mkdir /mnt/boot
mount /dev/sdX2 /mnt/boot
mkdir /mnt/boot/efi
mount /dev/sdX1 /mnt/boot/efi

# install enough packages to make it a viable machine.
pacstrap /mnt base base-devel grub-efi-x86_64 zsh vim git efibootmgr dialog wpa_supplicant

# basic configuration of the system.
genfstab -pU /mnt >> /mnt/etc/fstab
arch-chroot /mnt /bin/bash
echo computer_name > /etc/hostname
locale-gen
echo LANG=en_US.UTF-8 >> /etc/locale.conf
echo LANGUAGE=en_US >> /etc/locale.conf
echo LC_ALL=C >> /etc/locale.conf

ln -s /usr/share/zoneinfo/US/Pacific /etc/localtime
hwclock --systohc --utc
passwd
useradd - -g users -G wheel,storage,power,audio -s /bin/zsh me
passwd me

# make system bootable
vim /etc/mkinitcpio.conf
# Add 'ext4' to MODULES
# Add 'lvm2' to HOOKS before filesystems
mkinitcpio -p linux
grubinstall
grub-mkconfig -o /boot/grub/grub.cfg

# call it a day.
exit
umount -R /mnt
swapoff -a
reboot
```

## Post reboot

Basic networking:

```
sudo wifi-menu
sudo pacman -S openssh
sudo systemctl start sshd.service
```

X11:

```
# For optional packages, I selected "nvidia-libgl" and "xf86-input-evdev"
sudo pacman -S xorg-server xorg-server-utils xorg-apps
sudo pacman -S nvidia
sudo nvidia-xconfig
sudo pacman -S sddm plasma-meta
sudo reboot
```



