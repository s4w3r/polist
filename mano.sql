-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-02-2024 a las 16:43:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12
USE mano;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mano`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manzana`
--

CREATE TABLE `manzana` (
  `Codigo_m` int(11) NOT NULL,
  `Nombre_m` varchar(30) DEFAULT NULL,
  `Localidad` varchar(30) DEFAULT NULL,
  `Direccion` varchar(30) DEFAULT NULL,
  `Municipio` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `manzana`
--

INSERT INTO `manzana` (`Codigo_m`, `Nombre_m`, `Localidad`, `Direccion`, `Municipio`) VALUES
(2, 'Colina', NULL, 'Cll 27 norte #3B-22', NULL),
(3, 'Molinos', NULL, 'Cll 30 sur #4C-32', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manzana_servicios`
--

CREATE TABLE `manzana_servicios` (
  `Codigo_m` int(50) DEFAULT NULL,
  `Codigo_s` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `manzana_servicios`
--

INSERT INTO `manzana_servicios` (`Codigo_m`, `Codigo_s`) VALUES
(2, 6),
(2, 5),
(2, 2),
(2, 4),
(3, 8),
(3, 7),
(3, 1),
(3, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `Codigo_s` int(11) NOT NULL,
  `Nombre_s` varchar(30) DEFAULT NULL,
  `Tipo` varchar(30) DEFAULT NULL,
  `Categoria` varchar(30) DEFAULT NULL,
  `Descripcion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`Codigo_s`, `Nombre_s`, `Tipo`, `Categoria`, `Descripcion`) VALUES
(1, 'Cine', 'Entretenimiento', NULL, NULL),
(2, 'Piscina', 'Deporte', NULL, NULL),
(3, 'GYM', 'Deporte', NULL, NULL),
(4, 'Cocina', 'Gastronomia', NULL, NULL),
(5, 'Lavanderia', 'Aseo', NULL, NULL),
(6, 'Coser', 'Maquinaria', NULL, NULL),
(7, 'Yoga', 'Deporte', NULL, NULL),
(8, 'Clases de baile', 'Entretenimiento', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `Codigo_soli` int(11) NOT NULL,
  `Fecha` datetime DEFAULT NULL,
  `Codigo_u` int(50) DEFAULT NULL,
  `Codigo_s` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`Codigo_soli`, `Fecha`, `Codigo_u`, `Codigo_s`) VALUES
(20, '2024-02-17 11:15:00', 15, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Codigo_u` int(11) NOT NULL,
  `Nombre` varchar(30) DEFAULT NULL,
  `Tipo_documento` varchar(30) DEFAULT NULL,
  `Documento` int(30) DEFAULT NULL,
  `Codigo_m` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Codigo_u`, `Nombre`, `Tipo_documento`, `Documento`, `Codigo_m`) VALUES
(15, 'Nate', 'Cedula de Ciudadania', 1023242214, 2),
(16, 'Julian', 'Cedula de Ciudadania', 10242232, NULL),
(17, 'Johan', 'Cedula de Ciudadania', 2147483647, NULL),
(18, 'Carlos', 'Tarjeta de Identidad', 1011094350, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `manzana`
--
ALTER TABLE `manzana`
  ADD PRIMARY KEY (`Codigo_m`);

--
-- Indices de la tabla `manzana_servicios`
--
ALTER TABLE `manzana_servicios`
  ADD KEY `fk_id1` (`Codigo_m`),
  ADD KEY `fk_id2` (`Codigo_s`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`Codigo_s`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`Codigo_soli`),
  ADD KEY `fk_id4` (`Codigo_u`),
  ADD KEY `fk_id5` (`Codigo_s`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Codigo_u`),
  ADD KEY `fk_id3` (`Codigo_m`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `manzana`
--
ALTER TABLE `manzana`
  MODIFY `Codigo_m` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `Codigo_s` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `Codigo_soli` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Codigo_u` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `manzana_servicios`
--
ALTER TABLE `manzana_servicios`
  ADD CONSTRAINT `fk_id1` FOREIGN KEY (`Codigo_m`) REFERENCES `manzana` (`Codigo_m`),
  ADD CONSTRAINT `fk_id2` FOREIGN KEY (`Codigo_s`) REFERENCES `servicios` (`Codigo_s`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `fk_id4` FOREIGN KEY (`Codigo_u`) REFERENCES `usuario` (`Codigo_u`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_id3` FOREIGN KEY (`Codigo_m`) REFERENCES `manzana` (`Codigo_m`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

DROP CONSTRAINT fk_id4 WHERE usuario.Codigo_u = 17;
SELECT usuario.Codigo_u FROM usuario WHERE usuario.Documento = 2147483647;

DELETE FROM solicitudes WHERE solicitudes.Codigo_u= 19;



