<?php
require_once __DIR__ . '/baseTestCase.php';
require_once __DIR__ . '/../src/php/adminAgenceService.php';

class AgenceServiceTest extends BaseTestCase {
    public function testCreateAgenceVide() {
        $service = new AgenceService($this->db);
        $result = $service->createAgence('');
        $this->assertFalse($result['success']);
        $this->assertEquals(400, $result['status']);
    }

    public function testCreateAgenceSuccess() {
        $service = new AgenceService($this->db);
        $result = $service->createAgence('Agence Test');
        $this->assertTrue($result['success']);
        $this->assertEquals(201, $result['status']);
    }

    public function testUpdateAgenceInexistante() {
        $service = new AgenceService($this->db);
        $result = $service->updateAgence(999, 'Nouvelle Agence');
        $this->assertFalse($result['success']);
        $this->assertEquals(404, $result['status']);
    }

    public function testDeleteAgenceInexistante() {
        $service = new AgenceService($this->db);
        $result = $service->deleteAgence(999);
        $this->assertFalse($result['success']);
        $this->assertEquals(404, $result['status']);
    }
}
