export function getAgeGroup(age) {
  if (!age) return 'teen'
  if (age <= 14) return 'child'
  if (age <= 17) return 'teen'
  return 'adult'
}
