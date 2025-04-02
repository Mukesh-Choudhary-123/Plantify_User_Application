# Plantify 

-----Create a Apk build------------

1.nvm use 18
2.npx expo prebuild
3.eas build

------Install apk in emulator-----

curl -L -o Plantify.apk https://expo.dev/artifacts/eas/vUwU6oNGfZnp936QBJ9EaZ.apk

adb install -r Plantify.apk
