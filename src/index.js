document.addEventListener("DOMContentLoaded", () => {
  const dogsTable = document.getElementById("dogs-table");
  const form = document.getElementById("dog-form");
  let dogsData = [];

  fetch("http://localhost:3000/dogs")
    .then((response) => response.json())
    .then((data) => {
      dogsData = data;
      renderDogsTable();
    })
    .catch((error) => console.error(error));

  function renderDogsTable() {
    dogsTable.innerHTML = "";

    dogsData.forEach((dog) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button data-id="${dog.id}" class="edit-btn">Edit</button></td>
        `;
      dogsTable.appendChild(row);
    });
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach((button) => {
      button.addEventListener("click", handleEdit);
    });
  }
  function handleEdit(event) {
    const dogId = event.target.dataset.id;
    const dog = dogsData.find((dog) => dog.id === parseInt(dogId));
    form.name.value = dog.name;
    form.breed.value = dog.breed;
    form.sex.value = dog.sex;
    form.dataset.id = dogId;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const dogId = form.dataset.id;
    const formData = new FormData(form);
    fetch(`http://localhost:3000/dogs/${dogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        breed: formData.get("breed"),
        sex: formData.get("sex"),
      }),
    })
      .then((response) => response.json())
      .then((updatedDog) => {
        const index = dogsData.findIndex((dog) => dog.id === updatedDog.id);
        if (index !== -1) {
          dogsData[index] = updatedDog;
        }
        renderDogsTable();
      })
      .catch((error) => console.error(error));

    form.reset();
  });
});
