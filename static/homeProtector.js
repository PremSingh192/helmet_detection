async function authenticate() {
  try {
    const access = localStorage.getItem("user_access");
    if (access) {
      const url = base_url + "/api/auth/isAuth";
      // // Data to be sent in the request body (can be JSON, FormData, etc.)

      // // Options for the fetch request
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json", // Specify the content type if sending JSON data
        },
        body: JSON.stringify({}), // Convert JavaScript object to JSON string
      };

      const response = await fetch(url, options);
      const data = await response.json();
      if (response.status != 200) {
        console.log("from home protector", data)
        window.location = base_url + "/login";
      }
      // if (response.status == 200) {
      //   console.log(data);
      //   localStorage.setItem("user_access", data.access);
      //   window.location=base_url
      // }
    } else {
      console.log("no token in local storage");
      window.location = base_url + "/login";
    }
  } catch (error) {
    console.log("from login", error);
  }
}
authenticate();
