import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Wrench } from "lucide-react";

interface ATSIssue {
  issue: string;
  severity: 'high' | 'medium' | 'low';
  fix: string;
}

interface ATSCheckProps {
  atsIssues: ATSIssue[];
}

const ATSCheck = ({ atsIssues }: ATSCheckProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">Critical</Badge>;
      case 'medium':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Warning</Badge>;
      default:
        return <Badge variant="secondary">Minor</Badge>;
    }
  };

  const highIssues = atsIssues.filter(i => i.severity === 'high');
  const mediumIssues = atsIssues.filter(i => i.severity === 'medium');
  const lowIssues = atsIssues.filter(i => i.severity === 'low');

  const overallStatus = highIssues.length > 0 ? 'critical' : mediumIssues.length > 0 ? 'warning' : 'good';

  return (
    <div className="space-y-6">
      {/* Overall ATS Status */}
      <Card className={`border-2 ${
        overallStatus === 'critical' ? 'border-destructive/50 bg-destructive/5' :
        overallStatus === 'warning' ? 'border-warning/50 bg-warning/5' :
        'border-success/50 bg-success/5'
      }`}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            {overallStatus === 'critical' ? (
              <XCircle className="h-8 w-8 text-destructive" />
            ) : overallStatus === 'warning' ? (
              <AlertTriangle className="h-8 w-8 text-warning" />
            ) : (
              <CheckCircle className="h-8 w-8 text-success" />
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {overallStatus === 'critical' ? 'ATS Compatibility Issues Found' :
                 overallStatus === 'warning' ? 'Minor ATS Concerns' :
                 'ATS Optimized Resume'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {atsIssues.length === 0 
                  ? 'Your resume should parse well through most applicant tracking systems.'
                  : `Found ${atsIssues.length} issue${atsIssues.length > 1 ? 's' : ''} that may affect ATS parsing.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {atsIssues.length > 0 && (
        <div className="space-y-4">
          {atsIssues.map((issue, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <CardTitle className="text-base font-medium">{issue.issue}</CardTitle>
                  </div>
                  {getSeverityBadge(issue.severity)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                  <Wrench className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">How to fix</span>
                    <p className="text-sm text-foreground mt-1">{issue.fix}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {atsIssues.length === 0 && (
        <Card className="bg-muted/30">
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-success mb-3" />
            <p className="text-muted-foreground">
              No ATS compatibility issues detected. Your resume format looks good!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ATSCheck;
