import { Button } from '@/components/ui/button';
import { useVapi } from '@/useVapi';
import { useEffect, useState } from 'react';

export function App() {
  const vapi = useVapi();
  const [interviewStart, setInterviewStart] = useState<boolean>(false);
  useEffect(() => {
    if (!vapi) return;
    vapi.on('call-start', () => {
      console.log('Call started');
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
    });

    vapi.on('error', (error) => {
      console.error('Error:', error);
    });

    vapi.on('message', (msg) => {
      console.log('Message:', msg);
      if (msg?.functionCall?.name === 'evaluateQuestion') {
        console.log('Evaluating question', msg.functionCall);
      }

      if (msg?.functionCall?.name === 'endInterview') {
        vapi.stop();
        setInterviewStart(false);
      }
    });

    return () => {
      vapi.off('call-start', () => {
        console.log('Removed event listeners');
      });
      vapi.off('call-end', () => {
        console.log('Removed event listeners');
      });
      vapi.off('error', () => {
        console.log('Removed event listeners');
      });
    };
  }, [vapi]);

  const handleStartCall = async () => {
    await vapi?.start('1512c32c-62e2-4b12-9445-cb5250474e86');
    setInterviewStart(true);
  };

  const handleEndCall = () => {
    vapi?.stop();
  };

  const content = (
    <div className="flex gap-3">
      <Button onClick={handleStartCall} disabled={interviewStart}>
        {interviewStart ? 'Interview started' : 'Start Interview'}
      </Button>
      <Button variant="destructive" onClick={handleEndCall}>
        End Call
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {content}
    </div>
  );
}

export default App;
