package com.example.LearningManagementSystem.extra;

import java.util.List;

public interface ExtraService {

	int InsertUserExtra(ExtraDTO dto);

	List<ExtraDTO> getUserExtra(String user_id);

	int UpdateUserExtra(ExtraDTO dto);

}
