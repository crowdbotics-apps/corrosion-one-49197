import pxToRem from "assets/theme/functions/pxToRem";

export const ModalDeleteProjectBox = ({palette: {white, table}}) => ({
  background: white.main,
  borderRadius: "10px",
  border: `1px solid`,
  minHeight: pxToRem(314),
  left: '50%',
  paddingBlock: `${pxToRem(20)} ${pxToRem(40)}`,
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: pxToRem(444),
  '&:focus-visible': {outline: 'none !important'}
})

export const ModalDeleteTitle = ({palette: {table}}) => ({
  border: 'none',
  borderBottom: `1px solid`,
  fontSize: pxToRem(16),
  lineHeight: pxToRem(24),
  fontWeight: 400,
  letterSpacing: pxToRem(0.5),
  paddingBottom: pxToRem(20),
  textAlign: 'center',
  width: '100%',
})

export const ModalDeleteDialog = () => ({
  fontSize: pxToRem(14),
  fontWeight: 400,
  marginTop: pxToRem(31),
  textAlign: 'center',
  width: '100%',
})
