const contract = "dev-feedback.idea404.near";

// Define components
const greetingForm = (
  <>
    <div class="border border-black p-3">
      <label>Add feedback</label>
      <input placeholder="Type your ideas here" onChange={onInputChange} />
      <button class="btn btn-primary mt-2" onClick={onBtnClick}>
        Save
      </button>
    </div>
  </>
);

const notLoggedInWarning = <p> Login to change the greeting </p>;

// Render
return (
  <>
    <div class="container border border-info p-3">
      <h3 class="text-center">Got exciting ideas? Leave your feedback here:</h3>
      {context.accountId ? greetingForm : notLoggedInWarning}
    </div>
  </>
);