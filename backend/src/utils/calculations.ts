/**
 * Calculation formulas from backend-architecture.md section 8
 */

export function calcFuelEfficiency(totalDistanceKm: number, totalFuelL: number): number {
  if (totalFuelL === 0) return 0;
  return parseFloat((totalDistanceKm / totalFuelL).toFixed(2));
}

export function calcFleetUtilization(vehiclesOnTrip: number, totalActiveVehicles: number): number {
  if (totalActiveVehicles === 0) return 0;
  return parseFloat(((vehiclesOnTrip / totalActiveVehicles) * 100).toFixed(2));
}

export function calcOperationalCost(
  fuelCost: number,
  maintenanceCost: number,
  expensesAmount: number
): number {
  return parseFloat((fuelCost + maintenanceCost + expensesAmount).toFixed(2));
}

export function calcVehicleROI(
  revenue: number,
  maintenanceCost: number,
  fuelCost: number,
  acquisitionCost: number
): number {
  if (acquisitionCost === 0) return 0;
  return parseFloat(((revenue - (maintenanceCost + fuelCost)) / acquisitionCost).toFixed(4));
}
