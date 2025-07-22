// tests/BaseTestCase.php
<?php
use PHPUnit\Framework\TestCase;

class BaseTestCase extends TestCase {
    protected PDO $db;

    protected function setUp(): void {
        $this->db = new PDO('sqlite::memory:');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Crée les tables nécessaires
        $this->db->exec("
            CREATE TABLE users (
                id_user INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT, prenom TEXT, mail TEXT UNIQUE, role TEXT, password TEXT
            );
            CREATE TABLE agences (
                id_agence INTEGER PRIMARY KEY AUTOINCREMENT,
                agence TEXT
            );
            CREATE TABLE trajets (
                id_trajet INTEGER PRIMARY KEY AUTOINCREMENT,
                id_user INTEGER,
                id_agence_depart INTEGER,
                id_agence_arrivee INTEGER,
                date_depart TEXT,
                heure_depart TEXT,
                date_arrivee TEXT,
                heure_arrivee TEXT,
                place INTEGER
            );
        ");
    }
}
