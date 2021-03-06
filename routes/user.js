const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { newUser, updateUser, getUser, getUsers, deleteUser } = require('../controllers/users');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { isDate } = require('../helpers/date-validators');

const router = Router();

/*
    Rutas de Usuarios
    {{url}} + /api/user
*/

//Crear Usuario
router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de minimo 6 caracteres').isLength({ min: 6 }),
    check('email', 'El email es obligatorio o invalido').isEmail(),
    check('email').custom(emailExiste),
    check('lastModified').custom( isDate ),
    validarCampos
], newUser);

//Todas las rutan de abajo validan JWT
router.use( validarJWT );

//Actualizar Usuario
router.put('/:id',[
    //check('id', 'No es un id válido').isMongoId(), --> error, unida a validacion custom existeUsuarioPorId
    check('id').custom(existeUsuarioPorId),
    check('lastModified').custom( isDate ),
    // check('rol').custom(esRoleValido),
    validarCampos
], updateUser);

//Obtener Usuarios
router.get('/',[
    check('limit', 'El limit debe ser numerico').isNumeric().optional({nullable: true}),
    check('desde', 'Parametro desde debe ser numerico').isNumeric().optional({nullable: true}),
    validarCampos
], getUsers);

//Obtener Usuario
router.get('/:id', [
    check('id').custom(existeUsuarioPorId),
    validarCampos
], getUser);

//Borrar Usuario
router.delete('/:id',[
    tieneRole('ADMIN_ROLE'),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], deleteUser);

module.exports = router;
