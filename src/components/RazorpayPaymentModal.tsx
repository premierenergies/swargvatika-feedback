
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  email: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  isOpen,
  onClose,
  name,
  email
}) => {
  const [amount, setAmount] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handlePayment = () => {
    if (amount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with actual key when implementing
        amount: amount * 100, // Razorpay takes amount in paise
        currency: 'INR',
        name: 'Swarg Vatika Trust',
        description: 'Donation',
        image: 'https://example.com/your_logo.jpg', // Replace with your logo URL
        handler: function(response: any) {
          // Handle successful payment
          toast({
            title: "Payment Successful",
            description: `Thank you for your donation of ₹${amount}`,
            variant: "default"
          });
          onClose();
        },
        prefill: {
          name: name,
          email: email
        },
        theme: {
          color: '#FF9933'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };
      
      try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        toast({
          title: "Error",
          description: "Payment initialization failed. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load payment gateway. Please try again later.",
        variant: "destructive"
      });
      setLoading(false);
    };

    document.body.appendChild(script);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Make a Donation</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="donation-amount">Donation Amount (₹)</Label>
            <Input
              id="donation-amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min={1}
              className="text-lg"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[100, 500, 1000, 2000].map((preset) => (
              <Button 
                key={preset}
                variant="outline" 
                onClick={() => setAmount(preset)}
                className={`flex-1 ${amount === preset ? 'bg-accent border-primary' : ''}`}
              >
                ₹{preset}
              </Button>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            Your contribution helps us create a better world
          </div>
          
          <Button 
            onClick={handlePayment}
            disabled={loading || amount < 1}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Processing..." : `Donate ₹${amount}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayPaymentModal;

import { useState } from 'react';
