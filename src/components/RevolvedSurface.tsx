import { useMemo, isValidElement } from 'react'
import type { ReactElement } from 'react'
import verb from 'verb-nurbs'
import { NurbsCurve } from './NurbsCurve'
import type { NurbsCurveProps } from './NurbsCurve'

export interface RevolvedSurfaceProps {
  center?: [number, number, number]
  axis?: [number, number, number]
  angle?: number
  resolutionU?: number
  resolutionV?: number
  color?: string
  wireframe?: boolean
  children: ReactElement<NurbsCurveProps>
}

export const RevolvedSurface = ({
  center = [0, 0, 0],
  axis = [1, 0, 0],
  angle = 2 * Math.PI,
  resolutionU = 20,
  resolutionV = 20,
  color = '#ff0000',
  wireframe = false,
  children
}: RevolvedSurfaceProps) => {
  const geometry = useMemo(() => {
    // Validate child
    if (!isValidElement(children) || children.type !== NurbsCurve) {
      console.error('RevolvedSurface requires a single NurbsCurve child')
      return null
    }

    try {
      // Create NURBS curve from the child's props
      const { points, degree = 3, weights, knots } = children.props
      const defaultWeights = Array(points.length).fill(1)
      
      // Validate points array
      if (!points || points.length < 2) {
        console.error('Profile curve must have at least 2 points')
        return null
      }

      // Normalize the axis vector
      const axisLength = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2])
      if (axisLength === 0) {
        console.error('Axis vector cannot be zero')
        return null
      }
      const normalizedAxis: [number, number, number] = [
        axis[0] / axisLength,
        axis[1] / axisLength,
        axis[2] / axisLength
      ]

      // Create the profile curve
      const profileCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
        degree,
        knots,
        points,
        weights ?? defaultWeights
      )

      // Create the revolved surface
      const revolvedSurface = new verb.geom.RevolvedSurface(
        profileCurve,
        center,
        normalizedAxis,
        angle
      )

      // Create vertices and faces for the mesh
      const vertices: number[] = []
      const indices: number[] = []
      const uvs: number[] = []

      // Generate vertices and UVs
      for (let i = 0; i <= resolutionU; i++) {
        for (let j = 0; j <= resolutionV; j++) {
          const u = i / resolutionU
          const v = j / resolutionV
          const point = revolvedSurface.point(u, v)
          vertices.push(point[0], point[1], point[2])
          uvs.push(u, v)
        }
      }

      // Generate faces
      for (let i = 0; i < resolutionU; i++) {
        for (let j = 0; j < resolutionV; j++) {
          const a = i * (resolutionV + 1) + j
          const b = a + 1
          const c = (i + 1) * (resolutionV + 1) + j
          const d = c + 1

          indices.push(a, b, c)
          indices.push(b, d, c)
        }
      }

      return {
        vertices,
        indices,
        uvs
      }
    } catch (error) {
      console.error('Error creating revolved surface:', error)
      return null
    }
  }, [children, center, axis, angle, resolutionU, resolutionV])

  if (!geometry) return null

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={geometry.vertices.length / 3}
          array={new Float32Array(geometry.vertices)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uv"
          count={geometry.uvs.length / 2}
          array={new Float32Array(geometry.uvs)}
          itemSize={2}
        />
        <bufferAttribute
          attach="index"
          count={geometry.indices.length}
          array={new Uint32Array(geometry.indices)}
          itemSize={1}
        />
      </bufferGeometry>
      <meshStandardMaterial color={color} wireframe={wireframe} />
    </mesh>
  )
} 