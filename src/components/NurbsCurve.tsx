import { useMemo } from 'react'
import { Vector3 } from 'three'
import verb from 'verb-nurbs'
import { Line } from '@react-three/drei'
import type { LineProps } from '@react-three/drei'

export interface NurbsCurveProps extends Omit<LineProps, 'points'> {
  points: number[][]
  degree?: number
  weights?: number[]
  knots: number[]
  curveResolution?: number
}

export const NurbsCurve = ({
  points,
  degree = 3,
  weights,
  knots,
  curveResolution = 50,
  color = 'black',
  segments,
  dashed = false,
  vertexColors,
  ...lineProps
}: NurbsCurveProps) => {
  const curvePoints = useMemo(() => {
    if (!knots) {
      console.error('NurbsCurve requires knots to be provided')
      return []
    }

    try {
      // If weights are not provided, use array of 1s
      const defaultWeights = Array(points.length).fill(1)
      const verbCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
        degree,
        knots,
        points,
        weights ?? defaultWeights
      )

      // Create points along the curve
      return Array.from({ length: curveResolution + 1 }, (_, i) => {
        const t = i / curveResolution
        const point = verbCurve.point(t)
        return new Vector3(point[0], point[1], point[2])
      })
    } catch (error) {
      console.error('Error creating NURBS curve:', error)
      return []
    }
  }, [points, degree, weights, knots, curveResolution])

  if (curvePoints.length === 0) return null

  return (
    <Line
      points={curvePoints}
      color={color}
      segments={segments}
      dashed={dashed}
      vertexColors={vertexColors}
      {...lineProps}
    />
  )
} 