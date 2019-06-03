class DocumentRepository {
  constructor(adapter) {
    this.db = adapter.db;
  }

  async save(keyword, documents) {
    const query =
      `INSERT INTO documents 
      (keyword, title, link, description) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE
      title = VALUES(title)`;
    const values = [
      documents.map(({
        title, link, description
      }) => [
        keyword, title, link, description
      ])
    ];

    await this.db.execute(query, values);
  }
}


module.exports = DocumentRepository;
