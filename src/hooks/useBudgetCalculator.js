import { useState } from 'react';

export const useBudgetCalculator = () => {
  const [budget, setBudget] = useState(800);
  const [duration, setDuration] = useState('1 - 3 días');
  const [destination, setDestination] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState('');

  const handleBudgetChange = (value) => {
    setBudget(value);
  };

  const handleDurationChange = (value) => {
    setDuration(value);
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
  };

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handleTravelDateChange = (value) => {
    setTravelDate(value);
  };

  const handleSubmit = () => {
    const formData = {
      name,
      email,
      destination,
      travelDate,
      duration,
      budget
    };
    console.log('Plan de viaje enviado:', formData);
    // Aquí iría la lógica para enviar el formulario
    return formData;
  };

  return {
    budget,
    duration,
    destination,
    name,
    email,
    travelDate,
    handleBudgetChange,
    handleDurationChange,
    handleDestinationChange,
    handleNameChange,
    handleEmailChange,
    handleTravelDateChange,
    handleSubmit
  };
};
