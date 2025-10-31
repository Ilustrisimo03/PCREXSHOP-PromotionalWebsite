
    const appImages = [
      "src/assets/image/SampleUIMobile/Splash.png",
      "src/assets/image/SampleUIMobile/Signin.png",
      "src/assets/image/SampleUIMobile/Signup.png",
      "src/assets/image/SampleUIMobile/Home (1).png",
      "src/assets/image/SampleUIMobile/Products.png",
      "src/assets/image/SampleUIMobile/Products (1).png",
      "src/assets/image/SampleUIMobile/My Account.png",
      "src/assets/image/SampleUIMobile/DetailProduct.png",
      "src/assets/image/SampleUIMobile/DetailProduct (1).png",
      "src/assets/image/SampleUIMobile/Build a PC.png",
      "src/assets/image/SampleUIMobile/Build a PC (1).png",
      "src/assets/image/SampleUIMobile/Build a PC (2).png",
      "src/assets/image/SampleUIMobile/Build a PC (3).png",
      "src/assets/image/SampleUIMobile/Carts.png",
      "src/assets/image/SampleUIMobile/My Account.png",
      "src/assets/image/SampleUIMobile/Edit Profile.png",
      "src/assets/image/SampleUIMobile/Checkout.png",
      "src/assets/image/SampleUIMobile/Shipping Address.png",
      "src/assets/image/SampleUIMobile/Placed ORDER.png",
      "src/assets/image/SampleUIMobile/Purchase History.png",
      "src/assets/image/SampleUIMobile/Order Details.png",
    ];

    let currentImage = 0;
    const imageElement = document.getElementById("appImage");

    setInterval(() => {
      imageElement.style.opacity = '0'; // Start fade out
      setTimeout(() => {
        currentImage = (currentImage + 1) % appImages.length;
        imageElement.src = appImages[currentImage];
        imageElement.style.opacity = '1'; // Fade in new image
      }, 1000); // Match this with the CSS transition duration
    }, 4000); // 4s total per image (1s fade out, 3s visible)

