const contract = "dev.feedback.idea404.testnet";

State.init({ titleString: "", feedbackString: "" });

const changeText = ({ target }) => {
  State.update({ feedbackString: target.value });
};

const changeTitle = ({ target }) => {
  State.update({ titleString: target.value });
};

const onBtnClick = () => {
  if (!state.new_greeting) {
    return;
  }

  Near.call(contract, "add_new_feedback", {
    title: state.titleString,
    text: state.new_greeting,
  });
};

// Define components
const greetingForm = (
  <>
    <div class="border border-black p-3">
      <label>Give your feedback a title</label>
      <input placeholder="Give your feedback a title here" onChange={changeTitle} />
      <label>Add feedback</label>
      <input placeholder="Type your ideas here" onChange={changeText} />
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