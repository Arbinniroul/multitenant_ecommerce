import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import Image from "next/image";

export default function Home() {
  
  return (
    <div className="p-4">

    <div className="flex flex-col gap-4" >
<div>
<Button variant={'elevated'}>Im a button</Button>
</div>
<div>
  <Input placeholder="im an input"/>
</div>
<div>
<Progress value={50}/>
</div>
<div>
<Textarea placeholder="im a text area"/>
</div>
<div>
  <Checkbox/>
</div>
    </div>
    </div>
  );
}
