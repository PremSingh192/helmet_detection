console.log(base_url);
document.getElementById(
  "myredirect"
).innerHTML = `Already have an account ? <a href='${base_url}/login'>Login</a> `;
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission


  const username = event.target.username.value;
  const email = event.target.email.value;


  document.getElementById("username").value = "";
  document.getElementById("useremail").value = "";




  async function submitregister() {
    try {
      const url = base_url + "/api/register";
      // // Data to be sent in the request body (can be JSON, FormData, etc.)
      const body = {
        name: username,
        email: email,

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
        window.location = base_url + "/login";
      }
    } catch (error) {
      console.log("from register", error);
    }
  }
  submitregister();
});
