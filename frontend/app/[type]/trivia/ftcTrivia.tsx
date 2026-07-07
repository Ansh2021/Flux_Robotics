export default function FTCTrivia() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold w-fit text-center p-4">
          Welcome to FTC Trivia
        </h1>
        <p>
          I was going to add an FTC Trivia but I decided not to for now. FRC
          Trivia already took me so much time to make.
        </p>
      </div>

      {/* make the modal actually appear above the content instead of below*/}

      {/* <div id="frc-wordle-modal">
          <p>hi</p>
        </div> */}
    </main>
  );
}
