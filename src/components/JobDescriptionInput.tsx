import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionInput = ({ value, onChange }: JobDescriptionInputProps) => {
  return (
    <div className="w-full">
      <label htmlFor="job-description" className="block text-sm font-medium text-foreground mb-2">
        Job Description
      </label>
      <Textarea
        id="job-description"
        placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-none"
      />
      <p className="text-xs text-muted-foreground mt-2">
        Include as much detail as possible for better matching results
      </p>
    </div>
  );
};

export default JobDescriptionInput;
