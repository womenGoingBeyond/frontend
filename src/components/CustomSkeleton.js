import PropTypes from 'prop-types'
import Skeleton from '@mui/material/Skeleton'

export default function CustomSkeleton({ amount = 1 }) {
  const skeletonAmount = [...Array(amount).keys()]

  return (
    <>
      {skeletonAmount.map((num, index) =>
        <Skeleton
          sx={{ bgcolor: 'grey.300', width: '90%', height: '150px', mb: '1rem' }}
          variant="rectangular"
        />
      )}
    </>
  )
}

Skeleton.propTypes = {
  amount: PropTypes.number
}
