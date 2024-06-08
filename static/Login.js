console.log(base_url);
document.getElementById(
  "myredirect"
).innerHTML = `Don't you have an account ? <a href='${base_url}/register'>Register</a> `;
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  const email = event.target.email.value;
  const password = event.target.password.value;

  document.getElementById("useremail").value = "";
  document.getElementById("userpass").value = "";

  if (!email || !password) {
    alert("empty input fields");
    return;
  }

  async function submitregister() {
    try {
      const url = base_url + "/api/auth/login";
      // // Data to be sent in the request body (can be JSON, FormData, etc.)
      const body = {
        email: email,
        password: password,
      };

      console.log("body", body);

      // // Options for the fetch request
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type if sending JSON data
        },
        body: JSON.stringify(body), // Convert JavaScript object to JSON string
      };

      const response = await fetch(url, options);
      const data = await response.json();
      data.message ? alert(data.message) : console.log(response.status);
      if (response.status == 200) {
        console.log(data);
        localStorage.setItem("user_access", data.access);
        window.location = base_url;
      }
    } catch (error) {
      console.log("from login", error);
    }
  }
  submitregister();
});
