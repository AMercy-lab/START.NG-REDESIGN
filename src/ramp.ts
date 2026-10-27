// Piecewise-linear map computed in JS. Motion hands plain range transforms of
// opacity to the browser's scroll timeline, which mis-maps pinned sections, so
// scroll-driven values go through this instead (same helper as the tournament).
export function ramp(input: number[], output: number[]) {
  return (v: number) => {
    if (v <= input[0]) return output[0]
    for (let i = 1; i < input.length; i++) {
      if (v <= input[i]) {
        const t = (v - input[i - 1]) / (input[i] - input[i - 1])
        return output[i - 1] + (output[i] - output[i - 1]) * t
      }
    }
    return output[output.length - 1]
  }
}
