
<?php
require_once __DIR__ . '/baseTestCase.php';
require_once __DIR__ . '/../src/php/trajetService.php';

class TrajetServiceTest extends BaseTestCase {
    public function testCreateTrajetWithInvalidUser() {
        $service = new TrajetService($this->db);

        $result = $service->create([
            'id_user' => 999,
            'id_agence_depart' => '1',
            'id_agence_arrivee' => '2',
            'date_depart' => '2024-01-01',
            'heure_depart' => '10:00',
            'date_arrivee' => '2024-01-01',
            'heure_arrivee' => '09:00',
            'place' => '4'
        ]);

        $this->assertFalse($result['success']);
        $this->assertEquals(404, $result['status']);
    }

    public function testCreateTrajetSuccess() {
        $this->db->exec("
            INSERT INTO users (nom, prenom, mail, role, password)
            VALUES ('Jean', 'Dupont', 'jean@example.com', 'user', 'secret')
        ");
        $id_user = $this->db->lastInsertId();

        $service = new TrajetService($this->db);

        $result = $service->create([
            'id_user' => $id_user,
            'id_agence_depart' => '1',
            'id_agence_arrivee' => '2',
            'date_depart' => '2024-01-01',
            'heure_depart' => '10:00',
            'date_arrivee' => '2024-01-01',
            'heure_arrivee' => '12:00',
            'place' => '4'
        ]);

        $this->assertTrue($result['success']);
        $this->assertEquals(201, $result['status']);
    }
}
