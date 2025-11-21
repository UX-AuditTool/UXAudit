import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Workflow, AlertCircle } from 'lucide-react';
import { apiGetPublicProject } from '../lib/api';
import { PublicProject, FlowAudit } from '../types';
import Card, { CardContent } from '../components/ui/Card';
import { calculateFlowScore, calculateProjectScore, getScoreColor, getScoreLabel } from '../lib/utils/scoreCalculation';

const PublicProjectView = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!shareToken) return;

      try {
        setIsLoading(true);
        const data = await apiGetPublicProject(shareToken);
        setProject(data);
        // Select first flow by default if available
        if (data.flows.length > 0) {
          setSelectedFlowId(data.flows[0].id);
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('This audit report is not available or has been unpublished.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [shareToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4" />
          <p className="text-body-base text-neutral-600">Loading audit report...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <h1 className="font-heading text-2xl text-neutral-700 mb-2">Report Not Found</h1>
          <p className="text-body-base text-neutral-600">
            {error || 'The requested audit report could not be found.'}
          </p>
        </div>
      </div>
    );
  }

  // Calculate project score from flow audits
  const flowAudits = project.flows
    .map(f => f.flowAudit)
    .filter((audit): audit is FlowAudit => audit !== null);
  const { score: projectScore, flowCount } = calculateProjectScore(flowAudits);
  const projectScoreColors = getScoreColor(projectScore);
  const projectScoreLabel = getScoreLabel(projectScore);

  const selectedFlow = project.flows.find(f => f.id === selectedFlowId);
  const selectedAudit = selectedFlow?.flowAudit;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header - Client-facing branding */}
      <header className="bg-white border-b border-neutral-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-3xl text-neutral-800 mb-1">
                {project.name}
              </h1>
              <p className="text-body-base text-neutral-600">
                UX Audit Report for {project.clientName}
              </p>
              {project.auditGoal && (
                <p className="text-body-sm text-neutral-500 mt-2">
                  {project.auditGoal}
                </p>
              )}
            </div>

            {flowCount > 0 && (
              <div className="text-right px-6 py-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-label-xs text-neutral-500 mb-1">Overall Score</p>
                <p className="font-heading text-4xl text-neutral-800 mb-2">
                  {projectScore.toFixed(1)}<span className="text-xl text-neutral-400">/5</span>
                </p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-medium ${projectScoreColors.bg} ${projectScoreColors.text}`}>
                  {projectScoreLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 2-Column Layout */}
        <div className="grid grid-cols-4 gap-8">
          {/* Left Column: Flow List (1/4 width) */}
          <div className="col-span-1">
            <h2 className="font-heading text-lg text-neutral-700 mb-4">Flows Audited</h2>
            <div className="space-y-2">
              {project.flows.map((flow) => {
                const audit = flow.flowAudit;
                const { score } = audit ? calculateFlowScore(audit) : { score: 0 };
                const scoreColors = getScoreColor(score);
                const isSelected = flow.id === selectedFlowId;

                return (
                  <button
                    key={flow.id}
                    onClick={() => setSelectedFlowId(flow.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-white border-teal-500 shadow-sm'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium text-sm ${isSelected ? 'text-teal-700' : 'text-neutral-700'}`}>
                        {flow.name}
                      </span>
                      {score > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${scoreColors.bg} ${scoreColors.text}`}>
                          {score.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Flow Details (3/4 width) */}
          <div className="col-span-3">
            {selectedFlow && selectedAudit ? (
              <div className="space-y-6">
                {/* Flow Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-heading text-2xl text-neutral-800 mb-1">
                      {selectedFlow.name}
                    </h2>
                    {selectedFlow.description && (
                      <p className="text-body-sm text-neutral-600">{selectedFlow.description}</p>
                    )}
                  </div>
                  {(() => {
                    const { score } = calculateFlowScore(selectedAudit);
                    const scoreColors = getScoreColor(score);
                    return score > 0 ? (
                      <div className={`px-4 py-2 rounded-lg ${scoreColors.bg}`}>
                        <span className={`font-heading text-2xl ${scoreColors.text}`}>
                          {score.toFixed(1)}/5
                        </span>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Heuristic Violations */}
                {selectedAudit.heuristicViolations.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-heading text-lg text-neutral-800 mb-4">
                        Usability Issues Found
                      </h3>
                      <div className="space-y-4">
                        {selectedAudit.heuristicViolations
                          .filter(v => v.severity !== 'None')
                          .map((violation, index) => (
                            <div key={index} className="border-l-4 border-neutral-300 pl-4 py-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-neutral-800">
                                  {violation.heuristic}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  violation.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                  violation.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                  violation.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {violation.severity}
                                </span>
                              </div>
                              {violation.notes && (
                                <p className="text-body-sm text-neutral-600">{violation.notes}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Notes */}
                {(selectedAudit.platformNotes || selectedAudit.wcagNotes || selectedAudit.efficiencyBlockers || selectedAudit.errorHandlingNotes) && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-heading text-lg text-neutral-800 mb-4">
                        Additional Observations
                      </h3>
                      <div className="space-y-4">
                        {selectedAudit.platformNotes && (
                          <div>
                            <h4 className="font-medium text-neutral-700 mb-1">Platform Notes</h4>
                            <p className="text-body-sm text-neutral-600">{selectedAudit.platformNotes}</p>
                          </div>
                        )}
                        {selectedAudit.wcagNotes && (
                          <div>
                            <h4 className="font-medium text-neutral-700 mb-1">Accessibility Notes</h4>
                            <p className="text-body-sm text-neutral-600">{selectedAudit.wcagNotes}</p>
                          </div>
                        )}
                        {selectedAudit.efficiencyBlockers && (
                          <div>
                            <h4 className="font-medium text-neutral-700 mb-1">Efficiency Blockers</h4>
                            <p className="text-body-sm text-neutral-600">{selectedAudit.efficiencyBlockers}</p>
                          </div>
                        )}
                        {selectedAudit.errorHandlingNotes && (
                          <div>
                            <h4 className="font-medium text-neutral-700 mb-1">Error Handling</h4>
                            <p className="text-body-sm text-neutral-600">{selectedAudit.errorHandlingNotes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Compliance Status */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg text-neutral-800 mb-4">
                      Compliance Status
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-neutral-50 rounded-lg">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                          selectedAudit.wcagCompliant ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'
                        }`}>
                          {selectedAudit.wcagCompliant ? '✓' : '○'}
                        </div>
                        <p className="text-sm font-medium text-neutral-700">WCAG 2.2 AA</p>
                      </div>
                      <div className="text-center p-4 bg-neutral-50 rounded-lg">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                          selectedAudit.brandGuidelinesCompliant ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'
                        }`}>
                          {selectedAudit.brandGuidelinesCompliant ? '✓' : '○'}
                        </div>
                        <p className="text-sm font-medium text-neutral-700">Brand Guidelines</p>
                      </div>
                      <div className="text-center p-4 bg-neutral-50 rounded-lg">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                          selectedAudit.hipaaCompliant ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'
                        }`}>
                          {selectedAudit.hipaaCompliant ? '✓' : '○'}
                        </div>
                        <p className="text-sm font-medium text-neutral-700">HIPAA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-neutral-200">
                <div className="text-center">
                  <Workflow className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-body-base text-neutral-600">
                    Select a flow to view its audit details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 px-8 py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-body-sm text-neutral-500">
          UX Audit Report
        </div>
      </footer>
    </div>
  );
};

export default PublicProjectView;
