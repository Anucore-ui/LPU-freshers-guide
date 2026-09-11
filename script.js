// ================================
// CAMPUS SOS JAVASCRIPT
// ================================


// SEARCH
const search = document.querySelector("#search");

if (search) {

  const searchable = [
    ...document.querySelectorAll(".searchable")
  ];

  const contactGrid =
    document.querySelector("#contactGrid");

  const empty =
    document.querySelector("#empty");

  let activeFilter = "all";


  function updateResults() {

    const term =
      search.value.trim().toLowerCase();


    searchable.forEach(item => {

      const text =
        `${item.textContent} ${
          item.dataset.keywords || ""
        }`.toLowerCase();


      const searchMatch =
        !term || text.includes(term);


      const filterMatch =
        !item.classList.contains("contact-card") ||
        activeFilter === "all" ||
        (
          activeFilter === "favourite"
            ? item.classList.contains("favourite")
            : item.dataset.category === activeFilter
        );


      item.hidden =
        !(searchMatch && filterMatch);

    });


    if (contactGrid && empty) {

      const visibleContacts =
        [...contactGrid.children]
          .some(card => !card.hidden);

      empty.style.display =
        visibleContacts ? "none" : "block";
    }

  }


  search.addEventListener(
    "input",
    updateResults
  );


  // FILTER BUTTONS

  document
    .querySelectorAll(".filter")
    .forEach(button => {

      button.addEventListener("click", () => {

        document
          .querySelectorAll(".filter")
          .forEach(item =>
            item.classList.remove("active")
          );

        button.classList.add("active");

        activeFilter =
          button.dataset.filter;

        updateResults();

      });

    });


  // FAVOURITE CONTACTS

  const savedContacts =
    new Set(
      JSON.parse(
        localStorage.getItem("lpu-favourites") || "[]"
      )
    );


  document
    .querySelectorAll(".contact-card")
    .forEach(card => {

      const star =
        card.querySelector(".star");


      if (!star) return;


      function refresh() {

        const isSaved =
          savedContacts.has(card.dataset.id);


        card.classList.toggle(
          "favourite",
          isSaved
        );


        star.setAttribute(
          "aria-pressed",
          isSaved
        );


        star.textContent =
          isSaved ? "★" : "☆";

      }


      refresh();


      star.addEventListener("click", () => {

        if (
          savedContacts.has(card.dataset.id)
        ) {

          savedContacts.delete(
            card.dataset.id
          );

        } else {

          savedContacts.add(
            card.dataset.id
          );

        }


        localStorage.setItem(
          "lpu-favourites",
          JSON.stringify([
            ...savedContacts
          ])
        );


        refresh();

        updateResults();

      });

    });


  // CHECKLIST

  const tasks =
    [
      ...document.querySelectorAll(
        "[data-task]"
      )
    ];


  const savedTasks =
    new Set(
      JSON.parse(
        localStorage.getItem(
          "lpu-first-week"
        ) || "[]"
      )
    );


  const progressBar =
    document.querySelector("#progressBar");


  const progressText =
    document.querySelector("#progressText");


  function updateProgress() {

    const done =
      tasks.filter(
        task => task.checked
      ).length;


    if (progressBar) {

      progressBar.style.width =
        `${done / tasks.length * 100}%`;

    }


    if (progressText) {

      progressText.textContent =
        `${done} of ${tasks.length}`;

    }

  }


  tasks.forEach(task => {

    task.checked =
      savedTasks.has(
        task.dataset.task
      );


    task.addEventListener(
      "change",
      () => {

        if (task.checked) {

          savedTasks.add(
            task.dataset.task
          );

        } else {

          savedTasks.delete(
            task.dataset.task
          );

        }


        localStorage.setItem(
          "lpu-first-week",
          JSON.stringify([
            ...savedTasks
          ])
        );


        updateProgress();

      }
    );

  });


  updateProgress();


  // COPY BUTTON

  document
    .querySelectorAll(".copy")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          const number =
            button.dataset.copy;


          try {

            await navigator.clipboard.writeText(
              number
            );


            const oldText =
              button.textContent;


            button.textContent =
              "Copied!";


            setTimeout(() => {

              button.textContent =
                oldText;

            }, 1400);


          } catch {

            button.textContent =
              number;

          }

        }
      );

    });

}