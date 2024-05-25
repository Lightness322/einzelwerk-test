import AppForm from "./components/AppForm";

function App() {
  return (
    <section className="flex h-screen w-screen items-center justify-center bg-white">
      <AppForm>
        <AppForm.Heading />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <AppForm.NameInput />
            <div className="flex gap-4">
              <AppForm.PhoneInput />
              <AppForm.EmailInput />
            </div>
            <AppForm.SkillsSelect />
            <AppForm.DropZone />
          </div>
          <AppForm.Checkbox />
          <AppForm.Button />
        </div>
      </AppForm>
    </section>
  );
}

export default App;
