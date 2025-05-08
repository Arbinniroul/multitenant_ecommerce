import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import configPromise from "@payload-config";
import { getPayload } from "payload";

import Image from "next/image";

export default async function Home() {
    const payload = await getPayload({
      config: configPromise,
    })
    const data = await payload.find({
      collection:"categories",
    })
  
  return (
   <div>
    {
      JSON.stringify(data,null,2)
    }

   </div>
  );
}
