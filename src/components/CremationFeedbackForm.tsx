import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Check, Calendar, Phone, User } from 'lucide-react';

const CremationFeedbackForm = () => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [deceasedName, setDeceasedName] = useState('');
  const [otherService, setOtherService] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Services checkboxes state
  const [services, setServices] = useState({
    mortuary: false,
    cremationGround: false,
    rath: false,
    cremation: false,
    priestServices: false,
    poojaSamagri: false,
    seatingTent: false,
    waterBottles: false,
    ashCollection: false,
    airConditioning: false,
    bhajan: false,
    receipt: false,
    other: false
  });

  // Ratings state - default all to 0 (unselected)
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    helpfulness: 0,
    timeliness: 0,
    availability: 0,
    transparency: 0,
    coordination: 0
  });

  const handleServiceChange = (service) => {
    setServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleRatingChange = (aspect, value) => {
    setRatings(prev => ({
      ...prev,
      [aspect]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !contactNumber) {
      toast({
        title: "Please complete the form",
        description: "Name and contact number are required",
        variant: "destructive",
      });
      return;
    }
  
    // Construct the feedback object
    const feedbackData = {
      name, 
      contactNumber, 
      serviceDate, 
      deceasedName, 
      services, 
      ratings, 
      otherService, 
      comments,
      feedbackType: 'experience'
    };
  
    // Set submitting state
    setIsSubmitting(true);
  
    // Submit feedback to the backend
    try {
      console.log('Submitting feedback:', feedbackData);
      
      const response = await fetch('http://localhost:7733/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
        mode: 'cors', // Explicitly set CORS mode
      });
  
      const responseData = await response.json();
      
      if (response.ok) {
        console.log('Submission successful:', responseData);
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
        setSubmitted(true); // To show the thank you message
        resetForm();
      } else {
        console.error('Server returned error:', responseData);
        throw new Error(responseData.message || 'Error submitting feedback');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: `There was an error submitting your feedback: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setContactNumber('');
    setServiceDate('');
    setDeceasedName('');
    setServices({
      mortuary: false,
      cremationGround: false,
      rath: false,
      cremation: false,
      priestServices: false,
      poojaSamagri: false,
      seatingTent: false,
      waterBottles: false,
      ashCollection: false,
      airConditioning: false,
      bhajan: false,
      receipt: false,
      other: false
    });
    setRatings({
      cleanliness: 0,
      helpfulness: 0,
      timeliness: 0,
      availability: 0,
      transparency: 0,
      coordination: 0
    });
    setComments('');
    setOtherService('');
  };

  const renderRatingOptions = (aspect) => {
    return (
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <div key={`${aspect}-${value}`} className="flex items-center">
            <input
              type="radio"
              id={`${aspect}-${value}`}
              name={aspect}
              value={value}
              checked={ratings[aspect] === value}
              onChange={() => handleRatingChange(aspect, value)}
              className="mr-1"
            />
            <label htmlFor={`${aspect}-${value}`} className="text-sm">
              {value}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {!submitted ? (
        <>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-2xl text-blue-800 font-bold">
              Feedback Form
            </CardTitle>
            <p className="text-gray-600 mt-2">
              We value your feedback, which helps us improve our services. Please take a few minutes to share your thoughts.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Basic Information */}
              <div>
                <h2 className="text-lg font-medium text-blue-700 mb-4">1. Basic Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <Label htmlFor="name">Name of the Person Giving Feedback:</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 ml-2"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <Label htmlFor="contactNumber">Contact Number:</Label>
                    <Input
                      id="contactNumber"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="flex-1 ml-2"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <Label htmlFor="serviceDate">Date of Service Used:</Label>
                    <Input
                      id="serviceDate"
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                      className="flex-1 ml-2"
                      type="date"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <Label htmlFor="deceasedName">Name of Deceased (Optional):</Label>
                    <Input
                      id="deceasedName"
                      value={deceasedName}
                      onChange={(e) => setDeceasedName(e.target.value)}
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
              </div>
              
              {/* 2. Services Availed */}
              <div>
                <h2 className="text-lg font-medium text-blue-700 mb-4">2. Services Availed (Please tick all that apply):</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="mortuary"
                      checked={services.mortuary}
                      onCheckedChange={() => handleServiceChange('mortuary')}
                    />
                    <Label htmlFor="mortuary" className="leading-none pt-1">Mortuary</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="cremationGround" 
                      checked={services.cremationGround}
                      onCheckedChange={() => handleServiceChange('cremationGround')}
                    />
                    <Label htmlFor="cremationGround" className="leading-none pt-1">Cremation Ground Facility</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="rath"
                      checked={services.rath}
                      onCheckedChange={() => handleServiceChange('rath')}
                    />
                    <Label htmlFor="rath" className="leading-none pt-1">Rath (Funeral Carriage)</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="cremation"
                      checked={services.cremation}
                      onCheckedChange={() => handleServiceChange('cremation')}
                    />
                    <Label htmlFor="cremation" className="leading-none pt-1">Cremation</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="priestServices"
                      checked={services.priestServices}
                      onCheckedChange={() => handleServiceChange('priestServices')}
                    />
                    <Label htmlFor="priestServices" className="leading-none pt-1">Priest/Pandit Services [If applicable]</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="poojaSamagri"
                      checked={services.poojaSamagri}
                      onCheckedChange={() => handleServiceChange('poojaSamagri')}
                    />
                    <Label htmlFor="poojaSamagri" className="leading-none pt-1">Pooja Samagri Arrangement [If applicable]</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="seatingTent"
                      checked={services.seatingTent}
                      onCheckedChange={() => handleServiceChange('seatingTent')}
                    />
                    <Label htmlFor="seatingTent" className="leading-none pt-1">Seating & Tent Arrangements</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="waterBottles"
                      checked={services.waterBottles}
                      onCheckedChange={() => handleServiceChange('waterBottles')}
                    />
                    <Label htmlFor="waterBottles" className="leading-none pt-1">Cold drinking water bottles</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="ashCollection"
                      checked={services.ashCollection}
                      onCheckedChange={() => handleServiceChange('ashCollection')}
                    />
                    <Label htmlFor="ashCollection" className="leading-none pt-1">Ash Collection & Storage</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="airConditioning"
                      checked={services.airConditioning}
                      onCheckedChange={() => handleServiceChange('airConditioning')}
                    />
                    <Label htmlFor="airConditioning" className="leading-none pt-1">Air conditioning at waiting halls</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="bhajan"
                      checked={services.bhajan}
                      onCheckedChange={() => handleServiceChange('bhajan')}
                    />
                    <Label htmlFor="bhajan" className="leading-none pt-1">Playing of Bhajan in the rath & during cremation</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="receipt"
                      checked={services.receipt}
                      onCheckedChange={() => handleServiceChange('receipt')}
                    />
                    <Label htmlFor="receipt" className="leading-none pt-1">Receipt for payment made</Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="other"
                      checked={services.other}
                      onCheckedChange={() => handleServiceChange('other')}
                    />
                    <div className="flex flex-col">
                      <Label htmlFor="other" className="leading-none pt-1">Other (Please specify):</Label>
                      {services.other && (
                        <Input
                          id="otherService"
                          value={otherService}
                          onChange={(e) => setOtherService(e.target.value)}
                          className="mt-1"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Feedback on Services */}
              <div>
                <h2 className="text-lg font-medium text-blue-700 mb-4">3. Feedback on Services</h2>
                <p className="mb-3">Please rate the following aspects (1 - Very Poor, 5 - Excellent):</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left border py-2 px-3">Service Aspect</th>
                        <th className="text-center border py-2 px-3">Rating (1 to 5)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border py-2 px-3">Cleanliness of Cremation Ground</td>
                        <td className="border py-2 px-3 text-center">
                          {renderRatingOptions('cleanliness')}
                        </td>
                      </tr>
                      <tr>
                        <td className="border py-2 px-3">Helpfulness of Staff</td>
                        <td className="border py-2 px-3 text-center">
                          {renderRatingOptions('helpfulness')}
                        </td>
                      </tr>
                      <tr>
                        <td className="border py-2 px-3">Timeliness of Services</td>
                        <td className="border py-2 px-3 text-center">
                          {renderRatingOptions('timeliness')}
                        </td>
                      </tr>
                      <tr>
                        <td className="border py-2 px-3">Availability of Materials</td>
                        <td className="border py-2 px-3 text-center">
                          {renderRatingOptions('availability')}
                        </td>
                      </tr>
                      <tr>
                        <td className="border py-2 px-3">Transparency in Charges</td>
                        <td className="border py-2 px-3 text-center">
                          {renderRatingOptions('transparency')}
                        </td>
                      </tr>
                      <tr>
                        <td className="border py-2 px-3">Coordination by Trust Members [If applicable]</td>
                        <td className="border py-2 px-3 text-center">
                          {renderRatingOptions('coordination')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Additional Comments */}
              <div>
                <h2 className="text-lg font-medium text-blue-700 mb-4">4. Additional Comments or Suggestions:</h2>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto px-8 bg-blue-700 hover:bg-blue-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </form>
          </CardContent>
        </>
      ) : (
        <CardContent className="py-12 text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="text-green-500 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-semibold">Thank You!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
            <Button 
              onClick={() => setSubmitted(false)} 
              className="bg-blue-700 hover:bg-blue-800"
            >
              Submit Another Response
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CremationFeedbackForm;