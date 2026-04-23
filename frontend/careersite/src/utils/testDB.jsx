// import { supabase } from "../supabaseClient";

// async function testDB() {
//   const { data, error } = await supabase
//     .from("counsellors")
//     .select("id, name, email, credits_remaining");

//   console.log("DB DATA:", data);
//   console.log("DB ERROR:", error);
// }

// testDB();

// export default function TestDB() {
//   return <h2>Check console for DB output</h2>;
// }
import { useEffect } from "react";
// import { supabase } from "../supabaseClient";
import { supabase } from "../supabase/client";


export default function TestDB() {
  useEffect(() => {
    const testDB = async () => {
      const { data, error } = await supabase
        .from("counsellors")
        .select("id, name, email, credits_remaining");

      console.log("DB DATA:", data);
      console.log("DB ERROR:", error);
    };

    testDB();
  }, []);

  return (
    <div>
      <h2>Testing Database Connection...</h2>
    </div>
  );
}
