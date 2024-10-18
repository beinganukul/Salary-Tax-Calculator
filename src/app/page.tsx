"use client";

import { useState, useEffect, ChangeEvent } from "react";
import styles from './Home.module.css'; // Assuming you're using CSS modules

interface UpdatedValues {
  monthly?: number;
  dashain?: number;
  bonus?: number;
  basicSalary?: number;
  cit?: number;
  insurance?: number;
  health_insurance?: number;
}

export default function Home() {
  const [monthly, setMonthly] = useState<number>(0);
  const [dashain, setDashain] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  const [cit, setCit] = useState<number>(0);
  const [insurance, setInsurance] = useState<number>(0);
  const [healthInsurance, setHealthInsurance] = useState<number>(0);
  const [taxableIncome, setTaxableIncome] = useState<number>(0);
  const [married, setMarried] = useState<boolean>(false);
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [maxAllowedDeductible, setMaxAllowedDeductible] = useState<number>(0);
  const [totalCurrentDeductible, setTotalCurrentDeductible] = useState<number>(0);
  const [remainingDeductible, setRemainingDeductible] = useState<number>(0);
  const [tax1, setTax1] = useState<number>(0);
  const [tax10, setTax10] = useState<number>(0);
  const [tax20, setTax20] = useState<number>(0);
  const [tax30, setTax30] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);

  useEffect(() => {
    setTotalTax(tax1 + tax10 + tax20 + tax30);
  }, [tax1, tax10, tax20, tax30]);

  const calculateTax = (taxableIncome: number, married: boolean) => {
    let remaining = taxableIncome;
    console.log(married);
    if (remaining <= (married ? 600000 : 500000)) {
      setTax1(remaining * 0.01);
      setTax10(0);
      setTax20(0);
      setTax30(0);
      return;
    } else {
      remaining -= (married ? 600000 : 500000);
      setTax1(married ? 6000 : 5000);
    }

    if (remaining <= 200000) {
      setTax10(remaining * 0.1);
      setTax20(0);
      setTax30(0);
      return;
    } else {
      remaining -= 200000;
      setTax10(20000);
    }

    if (remaining <= 300000) {
      setTax20(remaining * 0.2);
      setTax30(0);
      return;
    } else {
      remaining -= 300000;
      setTax20(60000);
    }

    if (remaining <= 10000000) setTax30(remaining * 0.3);
    else setTax30(10000000 * 0.3);

    setTotalTax(tax1 + tax10 + tax20 + tax30);
  };

  const calculateValues = (updatedValues: UpdatedValues) => {
    const newMonthly = updatedValues.monthly || monthly;
    const newDashain = updatedValues.dashain || dashain;
    const newBonus = updatedValues.bonus || bonus;
    const newBasicSalary = updatedValues.basicSalary || basicSalary;
    const newCit = updatedValues.cit || cit;
    const newInsurance = updatedValues.insurance || insurance;
    const newHealthInsurance = updatedValues.health_insurance || healthInsurance;

    const newTaxableIncome = newMonthly * 12 + newDashain + newBonus;
    const newMaxAllowedDeductible = newTaxableIncome / 3 < 500000 ? newTaxableIncome / 3 : 500000;
    const newPfContribution = newBasicSalary * 0.2 * 12;
    const newGratitutyContribution = newBasicSalary * 0.0833 * 12;
    const newTotalCitContribution = newCit * 12;
    const newTotalCurrentDeductible = newPfContribution + newGratitutyContribution + newTotalCitContribution;

    setTaxableIncome(newTaxableIncome);
    setMaxAllowedDeductible(newMaxAllowedDeductible);
    setTotalCurrentDeductible(newTotalCurrentDeductible);
    setRemainingDeductible(newMaxAllowedDeductible - newTotalCurrentDeductible);
    calculateTax(newTaxableIncome - newTotalCurrentDeductible - newInsurance - newHealthInsurance, married);
  };

  const handleState = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value) || 0;

    switch (name) {
      case "monthly":
        setMonthly(parsedValue);
        break;
      case "dashain":
        setDashain(parsedValue);
        break;
      case "bonus":
        setBonus(parsedValue);
        break;
      case "cit":
        setCit(parsedValue);
        break;
      case "basicSalary":
        setBasicSalary(parsedValue);
        break;
      case "insurance":
        setInsurance(parsedValue);
        break;
      case "health_insurance":
        setHealthInsurance(parsedValue);
        break;
    }
    calculateValues({ [name]: parsedValue });
  };

  const handleMarried = (event: ChangeEvent<HTMLInputElement>) => {
    const isMarried = event.target.checked;
    setMarried(isMarried);
    calculateTax(taxableIncome - totalCurrentDeductible - insurance - healthInsurance, isMarried);
  };
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="monthly">Monthly Salary:</label>
          <input
            type="number"
            id="monthly"
            name="monthly"
            value={monthly === 0 ? "" : monthly}
            onChange={handleState}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="basicSalary">Basic Salary:</label>
          <input
            type="number"
            id="basicSalary"
            name="basicSalary"
            value={basicSalary === 0 ? "" : basicSalary}
            onChange={handleState}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dashain">Dashain Bonus:</label>
          <input
            type="number"
            id="dashain"
            name="dashain"
            value={dashain === 0 ? "" : dashain}
            onChange={handleState}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bonus">Other Bonus:</label>
          <input
            type="number"
            id="bonus"
            name="bonus"
            value={bonus === 0 ? "" : bonus}
            onChange={handleState}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cit">CIT Monthly:</label>
          <input
            type="number"
            id="cit"
            name="cit"
            value={cit === 0 ? "" : cit}
            onChange={handleState}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="health_insurance">Health Insurance:</label>
          <input
            type="number"
            id="health_insurance"
            name="health_insurance"
            value={healthInsurance === 0 ? "" : healthInsurance}
            onChange={handleState}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="life_insurance">Life Insurance:</label>
          <input
            type="number"
            id="insurance"
            name="insurance"
            value={insurance === 0 ? "" : insurance}
            onChange={handleState}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="married">Is Married: </label>

                <input
        type="checkbox"
        id="married"
        name="married"
        checked={married} // Bind the checkbox value to married state
        onChange={handleMarried} // Handle checkbox change
        className="checkbox"
      />
        </div>
      </form>

      <div className={styles.results}>
        {taxableIncome !== 0 && <h1>Taxable Income: {taxableIncome}</h1>}
        {maxAllowedDeductible !== 0 && <h1>Max Allowed Deductible: {maxAllowedDeductible.toFixed(3)}</h1>}
        {totalCurrentDeductible !== 0 && <h1>Total Current Deductible: {totalCurrentDeductible}</h1>}
        {remainingDeductible !== 0 && <h1>Remaining Deductible: {remainingDeductible.toFixed(3)}</h1>}
        {(tax1 || tax10 || tax20 || tax30) > 0 && (
          <table className={styles.taxTable}>
            <thead>
              <tr>
                <th>Slab</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1%</td>
                <td>{tax1}</td>
              </tr>
              <tr>
                <td>10%</td>
                <td>{tax10}</td>
              </tr>
              <tr>
                <td>20%</td>
                <td>{tax20}</td>
              </tr>
              <tr>
                <td>30%</td>
                <td>{tax30}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{totalTax}</td>
              </tr>
              <tr>
                <td>Tax Per Month</td>
                <td>Rs. {(totalTax / 12).toFixed(3)}</td>
              </tr>
              <tr>
                <td>Salary Per Month</td>
                <td>Rs. {((taxableIncome - totalTax - dashain - totalCurrentDeductible) / 12).toFixed(3)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
