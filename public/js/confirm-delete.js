// Shows the #delete-dialog pop-up before a message is deleted.
// Without JavaScript the delete forms still work, just without confirmation.
const dialog = document.getElementById("delete-dialog");
const titleSlot = document.getElementById("delete-dialog-title");
let pendingForm = null;

// 1. Delete clicked: stop the form, remember it, open the pop-up.
document.querySelectorAll(".delete-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    pendingForm = form;
    // textContent (not innerHTML), so a title can never inject HTML
    titleSlot.textContent = form.dataset.title;
    dialog.showModal();
  });
});

// 2. Pop-up closed (Cancel, Delete or Esc): only "confirm" sends the form.
// form.submit() doesn't fire the submit event again, so no loop.
dialog.addEventListener("close", () => {
  if (dialog.returnValue === "confirm" && pendingForm) {
    pendingForm.submit();
  }
  dialog.returnValue = "";
  pendingForm = null;
});
