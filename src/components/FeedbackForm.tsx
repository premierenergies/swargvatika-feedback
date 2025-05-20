
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import RazorpayPaymentModal from './RazorpayPaymentModal';
import { Check } from 'lucide-react';

type FeedbackType = 'suggestion' | 'experience' | 'donation' | 'volunteer';

const FeedbackForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('experience');
  const [submitted, setSubmitted] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast({
        title: "Please complete the form",
        description: "All fields marked with * are required",
        variant: "destructive",
      });
      return;
    }

    // If feedback type is donation, open payment modal
    if (feedbackType === 'donation') {
      setIsPaymentModalOpen(true);
      return;
    }
    
    // Here you would normally send the data to your backend
    console.log({ name, email, phone, message, feedbackType });
    
    // Show success message
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });
    
    // Reset form
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setFeedbackType('experience');
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        {!submitted ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-saffron-500 to-green-600 bg-clip-text text-transparent">
                  Swarg Vatika Trust
                </span>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                We value your feedback and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="feedbackType">What would you like to do? *</Label>
                    <RadioGroup
                      id="feedbackType"
                      value={feedbackType}
                      onValueChange={(value) => setFeedbackType(value as FeedbackType)}
                      className="grid grid-cols-2 gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="experience" id="experience" />
                        <Label htmlFor="experience" className="cursor-pointer">Share Experience</Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="suggestion" id="suggestion" />
                        <Label htmlFor="suggestion" className="cursor-pointer">Make a Suggestion</Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="donation" id="donation" />
                        <Label htmlFor="donation" className="cursor-pointer">Make a Donation</Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="volunteer" id="volunteer" />
                        <Label htmlFor="volunteer" className="cursor-pointer">Volunteer with Us</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {feedbackType === 'experience' && 'Share Your Experience *'}
                      {feedbackType === 'suggestion' && 'Your Suggestion *'}
                      {feedbackType === 'donation' && 'Message (Optional)'}
                      {feedbackType === 'volunteer' && 'How would you like to help? *'}
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Please share your ${feedbackType === 'volunteer' ? 'interest in volunteering' : feedbackType}`}
                      rows={5}
                      required={feedbackType !== 'donation'}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                type="submit" 
                onClick={handleSubmit}
                className="w-full md:w-auto px-8 bg-gradient-to-r from-saffron-500 to-green-500 hover:from-saffron-600 hover:to-green-600 border-none"
              >
                {feedbackType === 'donation' ? 'Proceed to Donation' : 'Submit Feedback'}
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="text-green-500 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold">Thank You!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {feedbackType === 'donation' 
                  ? 'Your generous contribution will make a difference.' 
                  : 'Your feedback has been submitted successfully. We appreciate your input!'}
              </p>
              <Button onClick={handleReset}>Submit Another Response</Button>
            </div>
          </CardContent>
        )}
      </Card>
      
      <RazorpayPaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSubmitted(true);
        }}
        name={name}
        email={email}
      />
    </>
  );
};

export default FeedbackForm;
