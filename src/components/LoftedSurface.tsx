import { useMemo, Children, isValidElement } from 'react'
import type { ReactElement } from 'react'
import verb from 'verb-nurbs'
import { NurbsCurve } from './NurbsCurve'
import type { NurbsCurveProps } from './NurbsCurve'

export interface LoftedSurfaceProps {
  degreeV?: number
  knotsV?: number[]
  resolutionU?: number
  resolutionV?: number
  color?: string
  wireframe?: boolean
  children: ReactElement<NurbsCurveProps>[]
}

export const LoftedSurface = ({
  degreeV = 3,
  knotsV,
  resolutionU = 20,
  resolutionV = 20,
  color = '#ff0000',
  wireframe = false,
  children
}: LoftedSurfaceProps) => {
  const geometry = useMemo(() => {
    // Filter and validate children
    const curves = Children.toArray(children).filter(
      (child): child is ReactElement<NurbsCurveProps> => 
        isValidElement(child) && child.type === NurbsCurve
    )

    if (curves.length < 2) {
      console.error('LoftedSurface requires at least 2 NurbsCurve children')
      return null
    }

    try {
      // Create NURBS curves from the children's props
      const nurbsCurves = curves.map(curve => {
        const { points, degree = 3, weights, knots } = curve.props
        const defaultWeights = Array(points.length).fill(1)
        return verb.geom.NurbsCurve.byKnotsControlPointsWeights(
          degree,
          knots,
          points,
          weights ?? defaultWeights
        )
      })

      // Create the lofted surface
      const loftedSurface = verb.geom.NurbsSurface.byLoftingCurves(nurbsCurves, degreeV)

      // Create vertices and faces for the mesh
      const vertices: number[] = []
      const indices: number[] = []
      const uvs: number[] = []

      // Generate vertices and UVs
      for (let i = 0; i <= resolutionU; i++) {
        for (let j = 0; j <= resolutionV; j++) {
          const u = i / resolutionU
          const v = j / resolutionV
          const point = loftedSurface.point(u, v)
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
      console.error('Error creating lofted surface:', error)
      return null
    }
  }, [children, degreeV, knotsV, resolutionU, resolutionV])

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