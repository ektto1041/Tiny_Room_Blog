package com.tinyroom.spring.blog.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBlog is a Querydsl query type for Blog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBlog extends EntityPathBase<Blog> {

    private static final long serialVersionUID = 229416411L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBlog blog = new QBlog("blog");

    public final NumberPath<Integer> blog_id = createNumber("blog_id", Integer.class);

    public final NumberPath<Integer> blog_theme = createNumber("blog_theme", Integer.class);

    public final StringPath blog_title = createString("blog_title");

    public final com.tinyroom.spring.member.domain.QMember member;

    public QBlog(String variable) {
        this(Blog.class, forVariable(variable), INITS);
    }

    public QBlog(Path<? extends Blog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBlog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBlog(PathMetadata metadata, PathInits inits) {
        this(Blog.class, metadata, inits);
    }

    public QBlog(Class<? extends Blog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com.tinyroom.spring.member.domain.QMember(forProperty("member")) : null;
    }

}

