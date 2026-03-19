import Header from "../components/layout/Header";
import Calendar from "../components/home/Calendar";
import TaskList from "../components/home/TaskList";
import Stats from "../components/home/Stats";
import { useAppState } from "../hooks/useAppState";

export default function Home() {
  const state = useAppState();

  return (
    <div className="p-4">

      <Header toggleMenu={() => {}} />

      <div className="d-flex gap-4">
        <Calendar {...state} />
        <TaskList {...state} />
      </div>

      <Stats stats={state.stats} />

    </div>
  );
}