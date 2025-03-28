from typing import List, Optional
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class TipoDeDoc(db.Model):
    """Modelo para los tipos de documentos. 1:N con Documentos"""

    __tablename__ = 'tipos_de_documentos'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(db.String)
    valores_attrib: Mapped[dict] = mapped_column(db.JSON)

    documentos: Mapped[List["Documentos"]] = relationship('Documentos', back_populates='tipo_de_documento')
    atributos: Mapped[List["Atributos"]] = relationship('Atributos', back_populates='tipo_de_documento')


class Atributos(db.Model):
    """Modelo para los atributos de los tipos de documentos. N:1 con TipoDeDoc"""

    __tablename__ = 'atributos'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(db.String)
    tipo_dato: Mapped[str] = mapped_column(db.String)
    requerido: Mapped[bool] = mapped_column(db.Boolean)
    tipo_de_documento_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('tipos_de_documentos.id'))

    tipo_de_documento: Mapped["TipoDeDoc"] = relationship('TipoDeDoc', back_populates='atributos')


class Documentos(db.Model):
    """Modelo para los documentos. 1:1 con Bloques y N:1 con TipoDeDoc"""

    __tablename__ = 'documentos'
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    creado_en: Mapped[datetime] = mapped_column(db.DateTime)
    hash: Mapped[str] = mapped_column(db.String)
    tipo_archivo: Mapped[str] = mapped_column(db.String)
    contenido: Mapped[str] = mapped_column(db.String)
    tipo_de_documento_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('tipos_de_documentos.id'))
    usuario_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('usuarios.id'))
    bloque_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('bloques.id'), unique=True)

    tipo_de_documento: Mapped["TipoDeDoc"] = relationship('TipoDeDoc', back_populates='documentos')
    usuario: Mapped["Usuarios"] = relationship('Usuarios', back_populates='documentos')
    bloque: Mapped["Bloques"] = relationship('Bloques', back_populates='documentos')

    def __repr__(self):
        return f'<Documento {self.id}>'


class Usuarios(db.Model):
    """Modelo para los usuarios. 1:N con Documentos"""

    __tablename__ = 'usuarios'
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(db.String)
    hash_contrasena: Mapped[str] = mapped_column(db.String)

    documentos: Mapped[List["Documentos"]] = relationship('Documentos', back_populates='usuario')

    def __repr__(self):
        return f'<Usuario {self.id}>'


class Bloques(db.Model):
    """Modelo para los bloques. 1:1 con Documentos y 1:1 consigo mismo para la cadena documental"""

    __tablename__ = 'bloques'
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    creado_en: Mapped[datetime] = mapped_column(db.DateTime)
    hash_previo: Mapped[Optional[str]] = mapped_column(db.String)
    hash: Mapped[str] = mapped_column(db.String)
    relacionado_con_bloque_id: Mapped[Optional[int]] = mapped_column(db.Integer, db.ForeignKey('bloques.id'), unique=True)

    documentos: Mapped["Documentos"] = relationship('Documentos', back_populates='bloque')
    relacionado_con_bloque: Mapped[Optional["Bloques"]] = relationship('Bloques', remote_side=[id], backref='bloque_relacionado')

    def __repr__(self):
        return f'<Bloque {self.id}>'