
    const appImages = [
      "src/assets/image/SampleUImobile/Splash.png",
      "src/assets/image/SampleUImobile/Signin.png",
      "src/assets/image/SampleUImobile/Signup.png",
      "src/assets/image/SampleUImobile/Home (1).png",
      "src/assets/image/SampleUImobile/Products.png",
      "src/assets/image/SampleUImobile/Products (1).png",
      "src/assets/image/SampleUImobile/My Account.png",
      "src/assets/image/SampleUImobile/DetailProduct.png",
      "src/assets/image/SampleUImobile/DetailProduct (1).png",
      "src/assets/image/SampleUImobile/Build a PC.png",
      "src/assets/image/SampleUImobile/Build a PC (1).png",
      "src/assets/image/SampleUImobile/Build a PC (2).png",
      "src/assets/image/SampleUImobile/Build a PC (3).png",
      "src/assets/image/SampleUImobile/Carts.png",
      "src/assets/image/SampleUImobile/My Account.png",
      "src/assets/image/SampleUImobile/Edit Profile.png",
      "src/assets/image/SampleUImobile/Checkout.png",
      "src/assets/image/SampleUImobile/Shipping Address.png",
      "src/assets/image/SampleUImobile/Placed ORDER.png",
      "src/assets/image/SampleUImobile/Purchase History.png",
      "src/assets/image/SampleUImobile/Order Details.png",
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

