package com.unicesar.roomies.model.entity;

public interface Reservable {
    Boolean estaDisponible();
    void reservar();
}